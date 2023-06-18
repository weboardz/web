const convertFormDataToObject = (formData: FormData) => {
  const data: { [index: string]: any } = {};
  formData.forEach((value, key) => (data[key] = value));
  return data;
};

export { convertFormDataToObject };
