import { useMemo, useState } from 'react';
import { categories, products } from '../data';

function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((item) => item.cat.toLowerCase() === activeCategory.toLowerCase());
  }, [activeCategory]);

  return (
    <main className="page-shell">
      <div className="page-card">
        <div className="page-inner">
          <p className="small-pill">MAĞAZA</p>
          <h1 className="page-title">Eyvaz1 Shop</h1>
          <p className="page-subtitle">
            Ətirlər, baxım məhsulları və hədiyyə dəstləri burada. Seçimi daraltmaq üçün kateqoriyaları tap.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <button
              type="button"
              className={`button-secondary ${activeCategory === 'all' ? 'button-primary' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              Bütün məhsullar
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`button-secondary ${activeCategory === category.id ? 'button-primary' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="cards-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="card-block" style={{ padding: '22px', minHeight: '230px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div className="small-pill">{product.cat}</div>
                  <div style={{ fontFamily: 'Marcellus, serif', fontSize: '28px' }}>{product.glyph}</div>
                </div>
                <h2 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '10px' }}>{product.title}</h2>
                <p className="card-text" style={{ marginBottom: '18px' }}>{product.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#c9a227' }}>{product.price}</strong>
                  <button type="button" className="button-secondary" style={{ width: '42px', height: '42px', padding: 0 }}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ShopPage;
