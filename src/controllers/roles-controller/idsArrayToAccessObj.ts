function idsArrayToAccessObj(ids: number[]) {
  return ids.map((accessId) => {
    return {
      id: accessId,
    };
  });
}

export default idsArrayToAccessObj;
