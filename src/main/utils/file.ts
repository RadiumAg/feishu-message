/**
 * 创建base64转file
 *
 * @param {string} base64
 * @param {string} type
 * @param {string} fileName
 * @return {*}
 */
const createBase64ToFile = (base64: string, type: string, fileName: string) => {
  const buffer = Buffer.from(base64.split(';base64,')[1], 'base64');

  const file = new File([buffer], fileName, {
    type,
  });

  return file;
};

export { createBase64ToFile };
