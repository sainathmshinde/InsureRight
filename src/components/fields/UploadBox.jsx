export function UploadBox({
  label = 'Click to upload',
  hint = 'PDF, JPG, PNG up to 5MB',
  accept,
  onChange,
}) {
  return (
    <label className="upload-box">
      <input type="file" style={{ display: 'none' }} accept={accept} onChange={onChange} />
      <div className="upload-icon">📎</div>
      <div className="upload-label">{label}</div>
      <div className="upload-hint">{hint}</div>
    </label>
  )
}
