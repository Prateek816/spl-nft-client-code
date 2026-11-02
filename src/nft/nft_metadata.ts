
import {
  createSignerFromKeypair,
  signerIdentity,
  createGenericFile,
} from "@metaplex-foundation/umi";

import wallet from "/Users/prateek/.config/solana/id.json";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

const umi = createUmi(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com"
);

const keypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(wallet)
);

const signer = createSignerFromKeypair(umi, keypair);

umi.use(
  irysUploader({
    address: "https://devnet.irys.xyz/",
  })
);

umi.use(signerIdentity(signer));

(async () => {
  try {
    // Image URI obtained from nft_image.ts
    const image =
      "https://gateway.irys.xyz/CPmhVbGiR3ZCCNKCEJkf4Mnv8neA7h5B4ztuPBWaPU4y";

    // NFT metadata
    const metadata = {
      name: "Meow",
      description: "CAT",
      image,

      attributes: [
        {
          trait_type: "Rarity",
          value: "Legendary",
        },
      ],

      properties: {
        files: [
          {
            type: "image/jpeg",
            uri: image,
          },
        ],
        category: "image",
      },
    };

    // Convert metadata object into JSON bytes
    const metadataString = JSON.stringify(metadata);

    const metadataFile = createGenericFile(
      new TextEncoder().encode(metadataString),
      "metadata.json",
      {
        contentType: "application/json",
      }
    );

    // Upload metadata JSON to Irys
    const [myUri] = await umi.uploader.upload([metadataFile]);

    console.log("Metadata uploaded successfully!");
    console.log("Metadata URI:", myUri);

  } catch (error) {
    console.log("Error:", error);
  }
})();
