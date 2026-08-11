async function testParse() {
  console.log("Downloading and parsing OpenScriptures Hebrew & Greek dictionaries...");

  // Hebrew
  const resH = await fetch("https://raw.githubusercontent.com/openscriptures/strongs/master/hebrew/strongs-hebrew-dictionary.js");
  let jsH = await resH.text();
  
  const funcH = new Function('module', 'exports', jsH + '; return module.exports;');
  const moduleH = { exports: {} };
  const hDict = funcH(moduleH, moduleH.exports);

  console.log("Hebrew dictionary keys count:", Object.keys(hDict).length);
  console.log("Hebrew sample H6664:", JSON.stringify(hDict['H6664'], null, 2));
  console.log("Hebrew sample H8199:", JSON.stringify(hDict['H8199'], null, 2));

  // Greek
  const resG = await fetch("https://raw.githubusercontent.com/openscriptures/strongs/master/greek/strongs-greek-dictionary.js");
  let jsG = await resG.text();
  
  const funcG = new Function('module', 'exports', jsG + '; return module.exports;');
  const moduleG = { exports: {} };
  const gDict = funcG(moduleG, moduleG.exports);

  console.log("Greek dictionary keys count:", Object.keys(gDict).length);
  console.log("Greek sample G3962:", JSON.stringify(gDict['G3962'], null, 2));
}

testParse();
