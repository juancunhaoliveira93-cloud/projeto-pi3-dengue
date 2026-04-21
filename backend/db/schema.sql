-- schema.sql atualizado para compatibilidade com o CSV do Gustavo


DROP TABLE IF EXISTS casos_dengue CASCADE;

CREATE TABLE casos_dengue (
    id SERIAL PRIMARY KEY,
    codigo_ibge INTEGER NOT NULL,
    municipio VARCHAR(255) NOT NULL,
    ano INTEGER NOT NULL,
    casos DECIMAL(15,2) DEFAULT 0, -- Aceita o formato 487.0 do Python
    taxa_incidencia DECIMAL(10,2) DEFAULT 0.00
);

CREATE INDEX idx_ano ON casos_dengue(ano);
CREATE INDEX idx_municipio ON casos_dengue(municipio);

-- Exemplo de comando que o Victor usou localmente:
-- COPY casos_dengue(codigo_ibge, municipio, ano, casos)
-- FROM 'C:/dengue_tratado.csv'
-- DELIMITER ','
-- CSV HEADER;