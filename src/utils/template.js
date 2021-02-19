
function safeText(text) {
  // Render as text node
  const html = document.createElement('p');
  html.appendChild(document.createTextNode(text));
  return html.innerHTML;
}

function Template(methods) {
  this.render = function(...args) {
    // Escape input values
    if (methods.safe !== false) {
      // Ensure args are safe
      args = args.map((value) => {
        return safeText(value);
      });
    }

    // Render template itself
    const container = document.createElement('div');
    const tpl = methods.template(...args);
    container.innerHTML = tpl;

    if (methods.className) {
      container.className = methods.className;
    }

    // Return element
    return container;
  };
}

export default Template;
