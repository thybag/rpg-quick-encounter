export default function(template, className = false) {
  const container = document.createElement('div');
  container.innerHTML = template;
  if(className) container.className = className
  return container;
}