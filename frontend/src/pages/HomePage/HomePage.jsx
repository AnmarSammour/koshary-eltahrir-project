import React, { useState, useEffect, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import MenuList from "../../components/menu/MenuList";
import Footer from "../../components/UI/Footer";
import DetailsModal from "../../components/UI/DetailsModal";
import CartIcon from "../../components/cart/CartIcon";
import { useLocale } from "../../i18n";
import "./HomePage.css";

const CATEGORY_KEYS = ["الكشري", "الإضافات", "المشروبات", "الحلويات"];

function HomePage() {
  const intl = useIntl();
  const [menuItems, setMenuItems] = useState([]);

  const categoriesForUI = [
    {
      value: CATEGORY_KEYS[0],
      label: intl.formatMessage({ id: "cat_koshary" }),
    },
    {
      value: CATEGORY_KEYS[1],
      label: intl.formatMessage({ id: "cat_addons" }),
    },
    {
      value: CATEGORY_KEYS[2],
      label: intl.formatMessage({ id: "cat_drinks" }),
    },
    {
      value: CATEGORY_KEYS[3],
      label: intl.formatMessage({ id: "cat_desserts" }),
    },
  ];

  const [activeCategory, setActiveCategory] = useState(CATEGORY_KEYS[0]);
  const sectionRefs = useRef({});
  const [selectedItem, setSelectedItem] = useState(null);
  const { locale } = useLocale();

  useEffect(() => {
    setActiveCategory(CATEGORY_KEYS[0]);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetch(`https://koshary-eltahrir-project-1.onrender.com/api/menu?lang=${locale}`)
      .then((res) => res.json())
      .then((data) => setMenuItems(data))
      .catch(console.error);
  }, [locale]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActiveCategory(e.target.dataset.category);
          }
        });
      },
      {
        rootMargin: "-40% 0px -60% 0px",
        threshold: 0,
      }
    );
    const currentRefs = Object.values(sectionRefs.current);
    currentRefs.forEach((sec) => {
      if (sec) observer.observe(sec);
    });
    return () => {
      currentRefs.forEach((sec) => {
        if (sec) observer.unobserve(sec);
      });
    };
  }, [menuItems]);

  const handleShowDetails = (item) => setSelectedItem(item);
  const handleCloseDetails = () => setSelectedItem(null);

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <h1 className="menu-title">
            <FormattedMessage id="menu" />
          </h1>
          <nav className="nav-filters">
            {categoriesForUI.map((c) => (
              <button
                key={c.value}
                className={`nav-btn ${
                  activeCategory === c.value ? "active" : ""
                }`}
                onClick={() => {
                  setActiveCategory(c.value);
                  const element = document.getElementById(
                    `category-${c.value}`
                  );
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
              >
                {c.label}
              </button>
            ))}
          </nav>
          <CartIcon />
        </div>
      </header>

      <MenuList
        items={menuItems}
        categories={CATEGORY_KEYS}
        categoriesForUI={categoriesForUI}
        registerRef={(el, category) => {
          sectionRefs.current[category] = el;
        }}
        onShowDetails={handleShowDetails}
      />

      <Footer />

      <DetailsModal item={selectedItem} onClose={handleCloseDetails} />
    </>
  );
}

export default HomePage;
