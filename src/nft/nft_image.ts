
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";

import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";

import wallet from "/Users/prateek/.config/solana/id.json";

const umi = createUmi(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com"
);

const keypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(wallet)
);

const signer = createSignerFromKeypair(umi, keypair);

// Configure Irys uploader
umi.use(
  irysUploader({
    address: "https://devnet.irys.xyz",
  })
);

// Set wallet identity
umi.use(signerIdentity(signer));

(async () => {
  try {
    // Read image from local filesystem
    const imageBuffer = await readFile("IMG_0778.jpeg");

    // Convert Buffer into Umi GenericFile
    const file = createGenericFile(
      new Uint8Array(imageBuffer),
      "IMG_0778.jpeg",
      {
        contentType: "image/jpeg",
      }
    );

    // Upload image to Irys
    const [myUri] = await umi.uploader.upload([file]);

    console.log("Your image URI:", myUri);

  } catch (error) {
    console.error("Upload failed:", error);
  }
})();
