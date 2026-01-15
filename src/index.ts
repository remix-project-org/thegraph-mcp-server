#!/usr/bin/env node
import { TheGraphMCPServer } from './server.js';

async function main() {
  try {
    const server = new TheGraphMCPServer();
    await server.start();
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
}

main();
