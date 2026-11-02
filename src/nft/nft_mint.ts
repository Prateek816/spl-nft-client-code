
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import wallet from "/Users/prateek/.config/solana/id.json";

import {
  createSignerFromKeypair,
  generateSigner,
  signerIdentity,
} from "@metaplex-foundation/umi";

import { create, mplCore } from "@metaplex-foundation/mpl-core";

import { base58 } from "@metaplex-foundation/umi/serializers";

const umi = createUmi(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com"
);

const keypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(wallet)
);

const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

umi.use(mplCore());

(async () => {
  try {
    const metadataUri =
      "https://gateway.irys.xyz/8oRmTmPQcd5qYW1qKVri5cU4w7Byzri2JLAqjGijmmqS";

    // Generate a new Core Asset signer
    const asset = generateSigner(umi);

    // Create and mint NFT
    const tx = await create(umi, {
      asset,
      name: "Meow",
      uri: metadataUri,
    }).sendAndConfirm(umi);

    // Convert transaction signature to Base58
    const signature = base58.deserialize(tx.signature)[0];

    console.log("NFT created successfully!");
    console.log(`Transaction Signature: ${signature}`);
    console.log(`Asset Address: ${asset.publicKey}`);

    console.log(
      `Explorer: https://explorer.solana.com/address/${asset.publicKey}?cluster=devnet`
    );

  } catch (e) {
    console.error("Error creating NFT:", e);
  }
})();
