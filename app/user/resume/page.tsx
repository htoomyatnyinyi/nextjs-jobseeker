import { uploadFile } from "./actions";
import FileUploadForm from "./FileUploadForm";
// import ResumeUploadForm from "./ResumeUploadForm";

export default function FileUpload() {
  return (
    <div>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis quo
        voluptatum a odit cumque et consequatur saepe fugit labore porro. Cum et
        quasi tenetur ea, assumenda quae sint voluptatum. Nesciunt.
      </p>
      <br />
      <FileUploadForm />
      <br />
      {/* <ResumeUploadForm /> */}
    </div>
  );
}
