import { useState } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data.imageUrl);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>AI Image Uploader</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div>
          <h3>Preview</h3>
          <img src={preview} width="250" />
        </div>
      )}

      <button onClick={handleUpload}>Upload & Process</button>

      {result && (
        <div>
          <h3>Processed Image</h3>
          <img src={result} width="250" />
        </div>
      )}
    </div>
  );
}

export default App;

