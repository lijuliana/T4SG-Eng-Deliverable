"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface AnimalDatum {
  name: string;
  speed: number;
  diet: "carnivore" | "herbivore" | "omnivore";
}

export default function AnimalSpeedGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<AnimalDatum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load the CSV data
        const response = await fetch("/sample_animals.csv");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        
        // Parse CSV manually
        const lines = csvText.split('\n');
        const parsedData: AnimalDatum[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',');
          if (values.length >= 3) {
            const name = values[0]?.trim();
            const speed = parseFloat(values[1]?.trim() || '0');
            const diet = values[2]?.trim() as "carnivore" | "herbivore" | "omnivore";
            
            if (name && speed > 0 && diet && ['carnivore', 'herbivore', 'omnivore'].includes(diet)) {
              parsedData.push({ name, speed, diet });
            }
          }
        }
        
        // Sort by speed and take top 20
        const sortedData = parsedData.sort((a, b) => b.speed - a.speed).slice(0, 20);
        setData(sortedData);
        setLoading(false);
        
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load animal data");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1000;
    const height = 500;
    const margin = { top: 60, right: 120, bottom: 80, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    svg
      .attr("width", width)
      .attr("height", height)
      .style("background", "#fafafa");

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.speed) || 0])
      .range([innerHeight, 0]);

    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(["carnivore", "herbivore", "omnivore"])
      .range(["#e74c3c", "#27ae60", "#f39c12"]);

    // Create bars
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.name) || 0)
      .attr("y", (d) => yScale(d.speed))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d.speed))
      .attr("fill", (d) => colorScale(d.diet))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8);
        
        const tooltip = d3
          .select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background", "rgba(0, 0, 0, 0.8)")
          .style("color", "white")
          .style("padding", "8px 12px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("z-index", "1000");

        tooltip
          .html(`<strong>${d.name}</strong><br/>Speed: ${d.speed} km/h<br/>Diet: ${d.diet}`)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        d3.selectAll(".tooltip").remove();
      });

    // Add x-axis
    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", "11px")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-45)");

    // Add y-axis
    g.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale).tickFormat((d) => `${d} km/h`))
      .selectAll("text")
      .style("font-size", "11px");

    // Add axis titles
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 80)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Animal");

    g.append("text")
      .attr("x", -innerHeight / 2)
      .attr("y", -60)
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Speed (km/h)");

    // Add chart title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .style("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text("Top 20 Fastest Animals by Diet");

    // Create legend
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - margin.right + 10}, ${margin.top})`);

    const legendData = [
      { diet: "carnivore", label: "Carnivore" },
      { diet: "herbivore", label: "Herbivore" },
      { diet: "omnivore", label: "Omnivore" },
    ];

    const legendItems = legend
      .selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`);

    legendItems
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d) => colorScale(d.diet))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);

    legendItems
      .append("text")
      .attr("x", 20)
      .attr("y", 12)
      .style("font-size", "12px")
      .style("alignment-baseline", "middle")
      .text((d) => d.label);

  }, [data]);

  if (loading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading animal data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <svg ref={svgRef} className="w-full h-auto" />
    </div>
  );
}
