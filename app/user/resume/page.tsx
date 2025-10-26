import { uploadFile } from "./actions";

export default function FileUpload() {
  return (
    <form action={uploadFile}>
      <input type="file" name="file" />
      <button type="submit">Upload</button>
    </form>
  );
}
