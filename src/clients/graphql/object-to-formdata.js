const objectToFormData = function(obj, namespace, form = new FormData()) {
  var formKey;

  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (namespace) {
        formKey = namespace + '[' + property + ']';
      } else {
        formKey = property;
      }

      // if the property is an object, but not a File,
      // use recursivity.
      if (
        typeof obj[property] === 'object' &&
        !(obj[property] instanceof File)
      ) {
        objectToFormData(obj[property], property, form);
      } else {
        console.log(formKey);
        // if it's a string or a File object
        form.append('variables.' + formKey, obj[property]);
      }
    }
  }

  return form;
};

export default objectToFormData;
