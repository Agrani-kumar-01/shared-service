import path from 'path';
import YAML from 'yamljs';

export const swaggerComponents = YAML.load(path.resolve(__dirname, './components.yaml'));
