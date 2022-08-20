for (let i = 0; i < formElement.childNodes.length; i++) {
    if (formElement.childNodes[i].tagName === 'INPUT') {
        formElement.childNodes[i].addEventListener("focus", () => formElement.childNodes[i].classList.add('focused'), true);
        formElement.childNodes[i].addEventListener("blur", () => formElement.childNodes[i].classList.remove('focused'), true);
    }
}