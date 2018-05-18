// takes the name of the field and a number, returns an error message orr a blank string to clear an error string
export const maxChars = (field, max) => {
    let extraChars = field.length - max;
    if (extraChars > 0) {
        return `Oops too long. Remove ${extraChars} characters.`
    }
    else {
        return ''
    }
}

// takes the name of the field and returns a boolean plus an error message
export const requiredField = (formField, messageName) => {
    const field = messageName;
    if(!formField){
        return {validation: false, message: `Please provide ${field}.`}
    }
    else{
        return {validation: true, message:''}
    }
}

// takes and email returns a boolean plus an error message
export const emailCheck = (email) => {
    // regular expression from https://stackoverflow.com/questions/7635533/validate-email-address-textbox-using-javascript
    let pattern = /\b[a-zA-Z0-9\u00C0-\u017F._%+-]+@[a-zA-Z0-9\u00C0-\u017F.-]+\.[a-zA-Z]{2,}\b/;
    if(!pattern.test(email)){
        return {validation: false, message: 'Please enter a valid email.'}
    }
    else{
        return {validation: true, message:''}
    }
}