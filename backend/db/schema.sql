-- schema.sql atualizado para compatibilidade com o CSV 


-- schema.sql
DROP TABLE IF EXISTS casos_dengue CASCADE;

CREATE TABLE casos_dengue (
    id SERIAL PRIMARY KEY,
    codigo_ibge INTEGER NOT NULL,
    municipio VARCHAR(255) NOT NULL,
    estado VARCHAR(2), -- ADICIONADO para aceitar ES, SP, RJ, etc.
    ano INTEGER NOT NULL,
    casos DECIMAL(15,2) DEFAULT 0, 
    taxa_incidencia DECIMAL(10,2) DEFAULT 0.00
);

CREATE INDEX idx_ano ON casos_dengue(ano);
CREATE INDEX idx_municipio ON casos_dengue(municipio);
CREATE INDEX idx_estado ON casos_dengue(estado); -- Índice extra para busca rápida
-- Exemplo de comando usado localmente:
-- COPY casos_dengue(codigo_ibge, municipio, ano, casos)
-- FROM 'C:/dengue_tratado.csv'
-- DELIMITER ','
-- CSV HEADER;