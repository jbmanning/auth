const SSM = require("aws-sdk").SSM;
const execSync = require("child_process").execSync;
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { performance } = require("perf_hooks");

const store = new SSM({ region: "us-east-1" });

const stage = "dev";
const baseName = `auth-jwt-${stage}`;
const privateName = `${baseName}-private.pem`;
const publicName = `${baseName}-public.pem`;
const privatefp = path.join("/tmp", privateName);
const publicfp = path.join("/tmp", publicName);

const alg = process.argv[2];

const testObj = {
  refreshID: "23b25493-c1b1-4bc3-bbb1-dd69858d5f7a",
  iat: 1543877445,
  ixp: 1543884645,
  axp: 1543927845,
  email: "test123@gmail.com",
  ip: "123.123.123.123",
  agent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
  os: "darwin"
};

const uploadParam = (name, value) => {
  store
    .putParameter({
      Name: name,
      Type: "SecureString",
      Value: value,
      Overwrite: stage !== "prod"
    })
    .promise()
    .then((data) => {
      console.log("RESULT");
      console.log(data);
    })
    .catch((err) => {
      console.log("ERR");
      console.log(err);
    });
};

if (!fs.existsSync(privatefp)) {
  // Has openssl commands for generating different key types
  // https://auth0.com/blog/brute-forcing-hs256-is-possible-the-importance-of-using-strong-keys-to-sign-jwts/

  switch (alg) {
    case "RS256":
      // RSA Keygen
      execSync(`openssl genpkey -algorithm RSA -out ${privatefp} -pkeyopt rsa_keygen_bits:2048`);
      execSync(`openssl rsa -pubout -in ${privatefp} -out ${publicfp}`);
      break;
    case "ES512":
      // https://gist.github.com/maxogden/62b7119909a93204c747633308a4d769
      // ecdsa keygen
      execSync(
        `openssl genpkey -algorithm EC -out ${privatefp} -pkeyopt ec_paramgen_curve:brainpoolP512t1 -pkeyopt ec_param_enc:named_curve`
      );
      execSync(`openssl ec -in ${privatefp} -pubout -out ${publicfp}`);
      break;
    default:
      throw new Error("INVALID ALG");
  }
}

const priv = fs.readFileSync(privatefp, "utf-8").trim();
const pub = fs.readFileSync(publicfp, "utf-8").trim();

const f = () => {
  const token = jwt.sign(testObj, priv, { algorithm: alg });
  const decoded = jwt.verify(token, pub, { algorithm: [alg] });
};

const n = 1000;
const t0 = performance.now();
for (let i = 0; i < n; i++) {
  f();
}
const t1 = performance.now();

console.log(`TIME: ${t1 - t0}; AVG: ${(t1 - t0) / n}`);

// console.log(token);

if (process.argv[3].toLowerCase() === "upload") {
  uploadParam(privateName, JSON.stringify({ key: priv, algorithm: alg }));
  uploadParam(publicName, JSON.stringify({ key: pub, algorithm: alg }));
}

fs.unlinkSync(privatefp);
fs.unlinkSync(publicfp);
