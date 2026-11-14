/**
 * Test-runner-only resolver for Node 22 --experimental-strip-types.
 * Vite can import TypeScript sources without extensions; vanilla Node cannot.
 * Resolve only relative, extensionless local TS/JS test imports.
 * This file is NEVER imported by the Saqr web application.
 */
export async function resolve(specifier,context,nextResolve){
  try{return await nextResolve(specifier,context);}
  catch(error){
    if(error?.code!=='ERR_MODULE_NOT_FOUND'||
       !specifier.startsWith('.')||/\.[^/]+$/.test(specifier))throw error;
    for(const ext of ['.ts','.tsx','.js','.mjs']){
      try{return await nextResolve(specifier+ext,context);}
      catch(candidateError){if(candidateError?.code!=='ERR_MODULE_NOT_FOUND')throw candidateError;}
    }
    throw error;
  }
}
