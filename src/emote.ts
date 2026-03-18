import fs from "fs";
import path from "path";
import { Canvas, Image } from "canvas";
import mergeImages from "merge-images";
import {cachePath, emotePath} from "./settings";

const fsPromises = fs.promises;
const fsConstants = fs.constants;

export const buildEmote = async(key:string, blueprint:Blueprint):Promise<string> => {

  try {
    const partData = await readEmoteParts(blueprint);

    let head: string | Buffer = "";
    let eyebrows: string | Buffer = "";
    let eyes: string | Buffer = "";
    let mouth: string | Buffer = "";

    partData.forEach((part) => {
      switch (part.key) {
      case "head":
        head = part.src;
        break;
      case "eyebrows":
        eyebrows = part.src;
        break;
      case "eyes":
        eyes = part.src;
        break;
      case "mouth":
        mouth = part.src;
        break;
      }
    });

    let b64 = await mergeImages(
      [ head, eyebrows, eyes, mouth],
      { Canvas: Canvas, Image: Image }
    );
    b64 = b64.replace(/^data:image\/\w+;base64,/, "");
    return await cacheEmote(key, b64);
  } catch {
    throw (new Error("buildEmote failed!"));
  }
};

export const cacheEmote = async(key:string, emote:string):Promise<string> => {
  const cachedEmotePath = `${cachePath}/${key.toLowerCase()}.png`;
  try {
    const buffer = Buffer.from(emote, "base64");
    await fsPromises.writeFile(cachedEmotePath, buffer);
    return cachedEmotePath;
  } catch {
    throw (new Error("cacheEmote failed!"));
  }
};

export const getCachedEmoteList = async():Promise<string[]> => {
  const filenames = await fsPromises.readdir(`${cachePath}`);
  const validEmotes:string[] = [];

  filenames.forEach(async(filename: string) => {
    try {
      if (path.extname(filename) === ".png") {
        validEmotes.push(filename);
      }
    }
    catch {
      console.error(`Failed to read: ${cachePath}/${filename}`);
      throw(new Error(`Failed to read: ${emotePath}/${filename}`));
    }
  });

  return validEmotes;
};

export const getCachedEmotePath = async(key:string):Promise<string | null> => {
  try {
    const cachedEmotePath = `${cachePath}/${key.toLowerCase()}.png`;
    const fileExists = await fsPromises.access(cachedEmotePath, fsConstants.R_OK)
      .then(() => true)
      .catch(() => false);
    return fileExists ? cachedEmotePath : null;
  } catch (error) {
    console.error(error);
    throw (new Error("getCachedEmotePath failed!"), error);
  }
};

function readEmoteParts({ character, head, eyebrows, eyes, mouth }:Blueprint) {
  const parts:Part[] = [
    { key: "head", name: head, src: Buffer.from("")},
    { key: "eyebrows", name: eyebrows, src: Buffer.from("")},
    { key: "eyes", name: eyes, src: Buffer.from("")},
    { key: "mouth", name: mouth, src: Buffer.from("")},
  ];

  const getPartData = async(part: Part):Promise<Buffer> => {
    try {
      return await fsPromises.readFile(
        `${emotePath}/${character.toLowerCase()}_${part.key.toLowerCase()}_${part.name.toLowerCase()}.png`
      );
    } catch {
      throw (new Error("getCachedEmotePath failed!"));
    }
  };

  return Promise.all(
    parts.map(async(part) => {
      part.src = await getPartData(part);
      return part;
    })
  );
}
