let selected = null;

/**
 * [dragOver description]
 * @param  {[type]} e [description]
 */
function dragOver(e) {
    if (isBefore(selected, e.target)) {
        e.target.parentNode.insertBefore(selected, e.target);
    } else {
        e.target.parentNode.insertBefore(selected, e.target.nextSibling);
    }
}

/**
 * [dragEnd description]
 */
function dragEnd() {
    selected = null;
}

/**
 * [dragStart description]
 * @param  {[type]} e [description]
 */
function dragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', null);
    selected = e.target;
}

/**
 * [isBefore description]
 * @param  {[type]}  el1 [description]
 * @param  {[type]}  el2 [description]
 * @return {boolean}
 */
function isBefore(el1, el2) {
    let cur;
    if (el2.parentNode === el1.parentNode) {
        for (cur = el1.previousSibling; cur; cur = cur.previousSibling) {
            if (cur === el2) return true;
        }
    }
    return false;
}

/**
 * [description]
 * @param  {[type]} elements [description]
 */
export default function(elements) {
    Array.from(elements).map((el) => {
        el.addEventListener('dragend', dragEnd);
        el.addEventListener('dragstart', dragStart);
        el.addEventListener('dragover', dragOver);
        el.draggable = true;
    });
}
