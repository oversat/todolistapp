-- Update existing chibi types to new types
UPDATE chibis
SET type = CASE
    WHEN type = 'pink' THEN 'fox'
    WHEN type = 'blue' THEN 'panda'
    WHEN type = 'purple' THEN 'purplebunny'
    WHEN type = 'green' THEN 'redcat'
    WHEN type = 'yellow' THEN 'yellowdog'
    WHEN type = 'yellow-dog' THEN 'yellowdog'
    ELSE type
END; 