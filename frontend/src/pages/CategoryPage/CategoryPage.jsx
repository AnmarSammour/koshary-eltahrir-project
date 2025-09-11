import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import MenuItem from "../../components/menu/MenuItem";
import DetailsModal from "../../components/UI/DetailsModal";
import "./CategoryPage.css";

const categoryTranslationIds = {
  الكشري: "cat_koshary",
  الإضافات: "cat_addons",
  المشروبات: "cat_drinks",
  الحلويات: "cat_desserts",
};

function CategoryPage() {
  const { categoryName } = useParams();
  const intl = useIntl();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const titleId = categoryTranslationIds[categoryName] || categoryName;
  const pageTitle = intl.formatMessage({ id: titleId });

  useEffect(() => {
    setLoading(true);
    fetch(`https://koshary-eltahrir-project-1.onrender.com/api/menu?lang=${intl.locale}`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.filter((i) => i.category === categoryName));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categoryName, intl.locale]);

  return (
    <div className="category-page">
      <header className="category-header">
        <Link
          to="/"
          className="back-link"
          aria-label={intl.formatMessage({ id: "back" })}
        >
          {intl.locale === "ar" ? "←" : "→"}
        </Link>
        <h1 className="category-title">{pageTitle}</h1>
      </header>
      {loading ? (
        <p className="loading">
          <FormattedMessage id="loading_items" />
        </p>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <MenuItem key={item.id} item={item} onShowDetails={setSelected} />
          ))}
        </div>
      )}
      <DetailsModal item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default CategoryPage;
