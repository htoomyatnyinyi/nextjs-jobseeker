import FileUploadForm from "./FileUploadForm";
import Preview from "./Preview";
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
      <div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
          error eaque deserunt totam velit eligendi possimus dicta explicabo
          molestias officia amet, aperiam eum fugit ducimus. Fugit voluptatibus
          et sequi perspiciatis?
        </p>
        {/* <Preview /> */}
      </div>
    </div>
  );
}
