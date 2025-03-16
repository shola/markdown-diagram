-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create diagrams table
CREATE TABLE diagrams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    content JSONB NOT NULL,
    mermaid_markdown TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create diagram_versions table
CREATE TABLE diagram_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    diagram_id UUID NOT NULL REFERENCES diagrams(id) ON DELETE CASCADE,
    content JSONB NOT NULL,
    mermaid_markdown TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT
);

-- Create indexes
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_diagrams_project_id ON diagrams(project_id);
CREATE INDEX idx_diagram_versions_diagram_id ON diagram_versions(diagram_id);
CREATE INDEX idx_diagram_versions_author_id ON diagram_versions(author_id);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagrams ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagram_versions ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view their own projects"
    ON projects FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own projects"
    ON projects FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own projects"
    ON projects FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own projects"
    ON projects FOR DELETE
    USING (auth.uid() = owner_id);

-- Diagrams policies
CREATE POLICY "Users can view diagrams of their projects"
    ON diagrams FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = diagrams.project_id
        AND projects.owner_id = auth.uid()
    ));

CREATE POLICY "Users can create diagrams in their projects"
    ON diagrams FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = diagrams.project_id
        AND projects.owner_id = auth.uid()
    ));

CREATE POLICY "Users can update diagrams in their projects"
    ON diagrams FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = diagrams.project_id
        AND projects.owner_id = auth.uid()
    ));

CREATE POLICY "Users can delete diagrams in their projects"
    ON diagrams FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = diagrams.project_id
        AND projects.owner_id = auth.uid()
    ));

-- Diagram versions policies
CREATE POLICY "Users can view versions of diagrams they own"
    ON diagram_versions FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM diagrams
        JOIN projects ON projects.id = diagrams.project_id
        WHERE diagrams.id = diagram_versions.diagram_id
        AND projects.owner_id = auth.uid()
    ));

CREATE POLICY "Users can create versions for their diagrams"
    ON diagram_versions FOR INSERT
    WITH CHECK (
        auth.uid() = author_id
        AND EXISTS (
            SELECT 1 FROM diagrams
            JOIN projects ON projects.id = diagrams.project_id
            WHERE diagrams.id = diagram_versions.diagram_id
            AND projects.owner_id = auth.uid()
        )
    );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diagrams_updated_at
    BEFORE UPDATE ON diagrams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();