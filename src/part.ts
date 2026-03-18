import fs from "fs";
import path from "path";
import { emotePath } from "./settings";
const fsPromises = fs.promises;

export const listAllParts = async():Promise<string[]> => {
  const filenames = await fsPromises.readdir(`${emotePath}`);
  const validParts:string[] = [];

  filenames.forEach(async(filename: string) => {
    try {
      if (path.extname(filename) === ".png") {
        validParts.push(filename);
      }
    }
    catch (error) {
      console.error(`Failed to read: ${emotePath}/${filename}`);
      throw(new Error(`Failed to read: ${emotePath}/${filename}`), error);
    }
  });

  return validParts;
};

export const listAllPartsForCharacter = async(character:string):Promise<string[]> => {
  try {
    const dirContents = await fsPromises.readdir(`${emotePath}`);
    return dirContents.filter((partFilename) => {
      return partFilename.startsWith(`${character.toLowerCase()}_`);
    });
  } catch {
    throw (new Error("listAllPartsForCharacter failed!"));
  }
};
