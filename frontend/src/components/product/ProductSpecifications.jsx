import React from 'react';

const ProductSpecifications = ({ specs }) => {
  return (
    <div className="product-specs">
      <h3 className="text-xl font-semibold mb-2">Specifications</h3>
      <ul className="list-disc ml-5">
        {specs && Object.entries(specs).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductSpecifications;
