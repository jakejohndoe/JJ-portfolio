"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const tailwindcss_1 = __importDefault(require("tailwindcss"));
const autoprefixer_1 = __importDefault(require("autoprefixer"));
const __dirname = path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)()],
    base: './',
    css: {
        postcss: {
            plugins: [(0, tailwindcss_1.default)(), (0, autoprefixer_1.default)()],
        },
    },
    resolve: {
        alias: {
            '@': path_1.default.resolve(__dirname, 'src'), // 👈 Correct since this is INSIDE client/
            '@/components': path_1.default.resolve(__dirname, 'src/components')
        }
    },
    build: {
        outDir: path_1.default.resolve(__dirname, "dist"),
        emptyOutDir: true,
        rollupOptions: {
            external: [], // 👈 Add any truly external dependencies here if needed
            output: {
                assetFileNames: 'assets/[name].[hash][extname]',
                entryFileNames: 'assets/[name].[hash].js'
            }
        }
    }
});
