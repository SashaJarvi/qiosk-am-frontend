function removeDuplicateObjects(array: Record<string, any>[], property: string) {
  const uniqueIds: Record<string, any>[] = [];

  return array.filter(element => {
    const isDuplicate = uniqueIds.includes(element[property]);

    if (!isDuplicate) {
      uniqueIds.push(element[property]);

      return true;
    }

    return false;
  });
}

export default removeDuplicateObjects;
