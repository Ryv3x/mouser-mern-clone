import React from 'react';

const ProductTable = ({ products }) => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2">Name</th>
          <th className="py-2">Price</th>
        </tr>
      </thead>
      <tbody>
        {products?.map((p) => (
          <tr key={p._id || p.id}>
            <td className="border px-4 py-2">{p.name}</td>
            <td className="border px-4 py-2">{p.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
