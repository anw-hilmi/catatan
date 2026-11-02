export const processPdfSubmit = async (
  credentials,
  actionConfig,
  submitFunction,
) => {
  const formData = new FormData();
  formData.append("username", credentials.username);
  formData.append("password", credentials.password);
  formData.append("title", actionConfig.pendingData.title);

  // Append semua file PDF yang dipilih
  if (actionConfig.pendingData.files) {
    console.log("Jumlah file di React:", actionConfig.pendingData.files.length); // Cek terminal browser Anda
    Array.from(actionConfig.pendingData.files).forEach((file) => {
      formData.append("files", file);
    });
  }
  // Jika EDIT, butuh ID. Jika ADD, kirim payload saja.
  if (actionConfig.type === "EDIT") {
    return await submitFunction(actionConfig.payload.id, formData);
  }
  return await submitFunction(formData);
};
