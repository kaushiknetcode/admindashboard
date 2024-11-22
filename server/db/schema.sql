-- Previous schema remains the same...

-- Add system_logs table for tracking system-wide actions
CREATE TABLE system_logs (
  id SERIAL PRIMARY KEY,
  action VARCHAR(50) NOT NULL,
  performed_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for system logs
CREATE INDEX idx_system_logs_action ON system_logs(action);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);