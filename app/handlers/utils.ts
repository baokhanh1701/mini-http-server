import fs from "node:fs";

export default class Utils {
  private readFileFromDir(query: string) {
    try {
      const data = fs.readFileSync(query);
      return data;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  private searchDirectory(query: string, file: string) {
    try {
      console.log(`==== CURRENT PATH: ${query} ====`);
      console.log(`==== FILE: ${file} ====`);
      const objects_in_dir = fs.readdirSync(query);
      if (objects_in_dir.length > 0) {
        console.log(`All objects current in dir: `, objects_in_dir);
        for (const object of objects_in_dir) {
          console.log(`-- object in dir: `, object);
          const statObject = fs.statSync(query + object);
          if (statObject.isDirectory()) {
            searchDirectory(query + object + "/", file);
          } else if (statObject.isFile()) {
            if (object === file) {
              console.log(`founded object file: ${file}`, object);
              return true;
            }
          } else {
            return false;
          }
        }
      } else {
        console.log("No objects in dir");
        return false;
      }
    } catch (err) {
      console.log("searchDirectory Error Log: ", err);
    }
  }
}
