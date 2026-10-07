import path from 'node:path';
import { mediaUrl, articleLink } from './content-tools.mjs';

export default function remarkImages() {
  return (tree, file) => {
    const relative = path.relative(path.resolve('content'), file.path).split(path.sep);
    const collection = relative.shift();
    const slug = relative.slice(0, -1).join('/');
    const referencedImages = new Set();
    function collect(node) { if (node.type === 'imageReference') referencedImages.add(node.identifier); node.children?.forEach(collect); }
    collect(tree);
    function visit(node) {
      if (node.type === 'image') node.url = mediaUrl(collection, slug, node.url, process.env.BASE_PATH);
      if (node.type === 'definition' && referencedImages.has(node.identifier)) node.url = mediaUrl(collection, slug, node.url, process.env.BASE_PATH);
      else if (node.type === 'link' || node.type === 'definition') node.url = articleLink(node.url, collection, slug, process.env.BASE_PATH);
      if (node.children) node.children.forEach(visit);
    }
    visit(tree);
  };
}
