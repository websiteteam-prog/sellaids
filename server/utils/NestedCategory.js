export const buildCategoryTree = (categories, parentId = null) => {
    const tree = []
    categories.forEach(cat => {
        if (cat.parent_id === parentId) {
            const children = buildCategoryTree(categories, cat.id)
            tree.push({
                ...cat,
                children: children.length ? children : []
            })
        }
    })
    return tree
}