
const validateObject = (object, data) => {

  for (let property in object) {

    if(property === 'filename' && isImage(object[property])) {
      data.validate = true;
      data.imageUrl = object['downloadUrl'];
    }

    if(typeof(object[property]) === 'object'){
      return validateObject(object[property], data)
    }

  }
  return data
};

// Regx validate image
const isImage = ( image ) => {
  let imageReg = /\.(gif|jpg|jpeg|tiff|png)$/i;
  return imageReg.test(image)
};


module.exports = {
  validateObject,
};
