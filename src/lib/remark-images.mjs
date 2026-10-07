import path from 'node:path';
import { mediaUrl } from './content-tools.mjs';

export default function remarkImages() {
  return (tree, file) => {
    const relative = path.relative(path.resolve('content'), file.path).split(path.sep);
    const collection = relative.shift();
    const slug = relative.slice(0, -1).join('/');
    function visit(node) {
      if (node.type === 'image') node.url = mediaUrl(collection, slug, node.url, process.env.BASE_PATH);
      if (node.children) node.children.forEach(visit);
    }
    visit(tree);
  };
}
