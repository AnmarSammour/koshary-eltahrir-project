import { useState, useEffect, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import CategoryFilters from "../../components/menu/CategoryFilters";
import MenuList from "../../components/menu/MenuList";
import Footer from "../../components/UI/Footer";
import DetailsModal from "../../components/UI/DetailsModal";
import CartIcon from "../../components/cart/CartIcon";
import { useLocale } from "../../i18n";
import "./HomePage.css";

function HomePage() {
  const intl = useIntl();
  const [menuItems, setMenuItems] = useState([]);

  const categoryKeys = ["الكشري", "الإضافات", "المشروبات", "الحلويات"];

  const categoriesForUI = [
    { value: "الكشري", label: intl.formatMessage({ id: "cat_koshary" }) },
    { value: "الإضافات", label: intl.formatMessage({ id: "cat_addons" }) },
    { value: "المشروبات", label: intl.formatMessage({ id: "cat_drinks" }) },
    { value: "الحلويات", label: intl.formatMessage({ id: "cat_desserts" }) },
  ];

  const [activeCategory, setActiveCategory] = useState(categoryKeys);
  const sectionRefs = useRef({});
  const [selectedItem, setSelectedItem] = useState(null);
  const { locale } = useLocale();

  useEffect(() => {
    fetch(`http://localhost:3000/api/menu?lang=${locale}`)
      .then((response) => response.json())
      .then((data) => setMenuItems(data))
      .catch((error) => console.error("Error fetching menu:", error));
  }, [locale]);

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const category = entry.target.dataset.category;
          setActiveCategory(category);
        }
      });
    };
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    const refs = sectionRefs.current;
    Object.values(refs).forEach((section) => {
      if (section) observer.observe(section);
    });
    return () => {
      Object.values(refs).forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [menuItems]);

  const handleShowDetails = (item) => setSelectedItem(item);
  const handleCloseDetails = () => setSelectedItem(null);

  return (
    <>
      <header className="app-header">
        <div className="main-header-content">
          <h1 className="menu-title">
            <FormattedMessage id="menu" />
          </h1>
          <CartIcon />
        </div>

        <CategoryFilters
          categories={categoriesForUI}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      </header>

      <MenuList
        items={menuItems}
        categories={categoryKeys}
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
