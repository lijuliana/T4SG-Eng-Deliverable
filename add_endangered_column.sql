-- Add endangered column to species table
ALTER TABLE species ADD COLUMN endangered boolean DEFAULT false;

-- Update existing seeded species to have endangered = false
UPDATE species SET endangered = false;
