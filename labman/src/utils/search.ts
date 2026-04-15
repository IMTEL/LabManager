import Fuse from 'fuse.js/basic';

export default function search(array : string[], query : string) : string[] {
    const fuse = new Fuse(array, {
    })

    return fuse.search(query).map(result => result.item)

}