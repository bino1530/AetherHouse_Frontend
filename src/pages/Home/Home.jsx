import "./Home.css";
const Home = () => {
  const products = [
    {
      id: 1,
      name: "Bell Portable",
      image_first: "/product1.webp",
      status: "Back in stock",
    },
    {
      id: 2,
      name: "Melt Medium Pendant",
      image_first: "/product2.webp",
      status: "New",
    },
    {
      id: 3,
      name: "Bobble Cushion",
      image_first: "/product3.webp",
      status: "New",
    },
    {
      id: 4,
      name: "Bump Tall Vase",
      image_first: "/product4.webp",
      status: "Gifts",
    },
  ];
  const categories = [
    { id: 1, name: "High-Glass Fluoro" },
    { id: 2, name: "Polished Bronze Polycarbonate" },
    { id: 3, name: "Ochre Wool-Mix Boucle" },
    { id: 4, name: "Handmade Green Glass" },
  ];
  const productCategories = [
    { productId: 1, categories_id: [1] },
    { productId: 2, categories_id: [2] },
    { productId: 3, categories_id: [3] },
    { productId: 4, categories_id: [4] },
  ];
  return (
    <div>
      <div className="home-banner">
        <div className="banner-content">
          <h1>Welcome to Aether House</h1>
          <p>Discover the amazing living space!</p>
          <button className="btn_style_1">
            <span>Explore Now</span>
          </button>
        </div>
      </div>
      <div className="studio_fav spacing">
        <h1>Favorite Studios</h1>
        <div className="row_studio_fav_content">
          <div className="col_studio_fav_1">
            <p>
              Discover what we're loving right now - from best-selling
              essentials to exciting new arrivals and handpicked favourites
              straight from the studio.
            </p>
          </div>
          <div className="col_studio_fav_2">
            <button className="btn_style_2 hidden-back">
              <span>Explore Now</span>
            </button>
          </div>
        </div>
        <div className="row_studio_fav_product row">
          {/* do cái product nó link với categories nên phải làm bước này cái ha */}
          {products.map((product) => {
            const productCat = productCategories.find(
              (pc) => pc.productId === product.id
            );
            const categoryNames =
              productCat?.categories_id.map(
                (id) => categories.find((c) => c.id === id)?.name
              ) || [];

            return (
              <div
                key={product.id}
                className="col_studio_fav_product_1 col-lg-3 col-sm-6 col-12"
              >
                <div className="studio_card">
                  <div className="studio_img_wrapper">
                    <img
                      src={product.image_first}
                      alt={product.name}
                      className="studio_img"
                    />
                    <span className="studio_status">{product.status}</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p className="studio_categories">
                    {categoryNames.join(", ")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <button className="btn_style_2 hidden spacing-top">
          <span>Explore Now</span>
        </button>
      </div>
      <div className="home-banner-2 spacing">
        <div className="banner-content-2">
          <h1>Portable Lighting</h1>
          <p>
            Versatile, rechargeable, and expertly designed. Compact yet
            powerful, our portable lights offer 9 hours of battery life and
            energy-efficient LED lighting.
          </p>
          <button className="btn_style_1">
            <span>Shop Now</span>
          </button>
        </div>
      </div>
      <div className="home-newsletter spacing">
        <div className="newsletter-content-row row">
          <div className="newsletter-img col-lg-6 col-12">
            <img src="/bannerhome3.webp"></img>
          </div>
          <div className="newsletter-content col-lg-6 col-12">
            <h3>Glassware</h3>
            <p>
              Expertly crafted by skilled artisans, our mouth-blown glassware
              combines design with everyday functionality. Each piece rich in
              character and unmistakable charm.
            </p>
            <button className="btn_style_1">
              <span>View Collection</span>
            </button>
          </div>
        </div>
      </div>
      <div className="contact-us spacing">
        <h1> Can We Help?</h1>
        <div className="contact-content">
          <p>
            For any questions about our products, placing an order, or our
            design services, feel free to get in touch with our Customer
            Experience Team. We are here to help. We also invite you to visit
            our shops to explore our collections and designs in person.
          </p>
        </div>
        <div className="contact-buttons">
            <button className="btn_style_3">
              <span>Contact Us</span>
            </button>
            <button className="btn_style_3 ">
              <span>Visit Us</span>
            </button>
          </div>
      </div>
      <div className="usp">
          <section className="usp-section">
            <div className="usp-item">
              <div className="usp-item-left">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon-usp light"
                >
                  <symbol
                    id="icon-light"
                    viewBox="0 0 40 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M29.7294 11.822L30.886 11.3479V11.3479L29.7294 11.822ZM30.5304 15.7828L29.2804 15.7958L29.2933 17.0328H30.5304V15.7828ZM27.4465 8.36918L28.3351 7.48999L28.3351 7.48999L27.4465 8.36918ZM15.9701 6.0621L16.4528 7.21514L16.4528 7.21514L15.9701 6.0621ZM12.5537 8.36919L11.6651 7.48999L11.6651 7.48999L12.5537 8.36919ZM10.2709 11.822L9.11423 11.3479H9.11423L10.2709 11.822ZM9.46982 15.7828V17.0328H10.7069L10.7198 15.7958L9.46982 15.7828ZM9.46924 15.7828V14.5328H8.21924V15.7828H9.46924ZM9.46924 19.1437H8.21924V20.3937H9.46924V19.1437ZM19.3279 19.1437H20.5779V17.8937H19.3279V19.1437ZM19.3279 23.2517L19.5644 24.4791L20.5779 24.2838V23.2517H19.3279ZM18.5259 23.4924L19.0042 24.6472H19.0042L18.5259 23.4924ZM16.2825 25.7357L15.1277 25.2573L16.2825 25.7357ZM15.9685 27.2099V28.4599H17.1852L17.2181 27.2437L15.9685 27.2099ZM15.967 27.2099V25.9599H14.717V27.2099H15.967ZM15.967 35.5002H14.717V36.7502H15.967V35.5002ZM24.2573 35.5002V36.7502H25.5073V35.5002H24.2573ZM24.2573 27.2099H25.5073V25.9599H24.2573V27.2099ZM24.2557 27.2099L23.0062 27.2437L23.0391 28.4599H24.2557V27.2099ZM23.9417 25.7357L22.7869 26.214L23.9417 25.7357ZM21.6984 23.4924L21.22 24.6472L21.22 24.6472L21.6984 23.4924ZM20.6723 23.2148H19.4223V24.3059L20.5034 24.4534L20.6723 23.2148ZM20.6723 19.1437V17.8937H19.4223V19.1437H20.6723ZM30.531 19.1437V20.3937H31.781V19.1437H30.531ZM30.531 15.7828H31.781V14.5328H30.531V15.7828ZM28.5727 12.296C29.0277 13.4061 29.2679 14.5942 29.2804 15.7958L31.7803 15.7698C31.7645 14.2524 31.4612 12.7513 30.886 11.3479L28.5727 12.296ZM26.558 9.24838C27.4204 10.12 28.1053 11.1555 28.5727 12.296L30.886 11.3479C30.295 9.90599 29.4284 8.59494 28.3351 7.48999L26.558 9.24838ZM23.5474 7.21514C24.6725 7.68611 25.6956 8.37679 26.558 9.24838L28.3351 7.48999C27.2417 6.38501 25.943 5.50779 24.5128 4.90905L23.5474 7.21514ZM20.0001 6.50195C21.217 6.50195 22.4224 6.74418 23.5474 7.21514L24.5128 4.90905C23.0825 4.3103 21.549 4.00195 20.0001 4.00195V6.50195ZM16.4528 7.21514C17.5778 6.74418 18.7832 6.50195 20.0001 6.50195V4.00195C18.4512 4.00195 16.9177 4.3103 15.4874 4.90905L16.4528 7.21514ZM13.4422 9.24838C14.3046 8.37679 15.3277 7.68611 16.4528 7.21514L15.4874 4.90905C14.0572 5.50779 12.7585 6.38502 11.6651 7.48999L13.4422 9.24838ZM11.4275 12.296C11.8949 11.1555 12.5798 10.12 13.4422 9.24838L11.6651 7.48999C10.5718 8.59494 9.70522 9.90599 9.11423 11.3479L11.4275 12.296ZM10.7198 15.7958C10.7323 14.5942 10.9725 13.4061 11.4275 12.296L9.11423 11.3479C8.53904 12.7513 8.23569 14.2524 8.21989 15.7698L10.7198 15.7958ZM9.46924 17.0328H9.46982V14.5328H9.46924V17.0328ZM10.7192 15.8948V15.7828H8.21924V15.8948H10.7192ZM10.7192 19.1437V15.8948H8.21924V19.1437H10.7192ZM19.3279 17.8937H9.46924V20.3937H19.3279V17.8937ZM20.5779 23.2517V19.1437H18.0779V23.2517H20.5779ZM19.0042 24.6472C19.1852 24.5722 19.3729 24.516 19.5644 24.4791L19.0914 22.0243C18.7346 22.093 18.3848 22.1978 18.0475 22.3375L19.0042 24.6472ZM18.065 25.2748C18.3338 25.006 18.653 24.7927 19.0042 24.6472L18.0475 22.3375C17.3929 22.6086 16.7982 23.006 16.2972 23.507L18.065 25.2748ZM17.4374 26.214C17.5829 25.8628 17.7961 25.5436 18.065 25.2748L16.2972 23.507C15.7962 24.008 15.3988 24.6028 15.1277 25.2573L17.4374 26.214ZM17.2181 27.2437C17.2276 26.8902 17.3019 26.5412 17.4374 26.214L15.1277 25.2573C14.8752 25.867 14.7368 26.5174 14.719 27.1761L17.2181 27.2437ZM15.967 28.4599H15.9685V25.9599H15.967V28.4599ZM17.217 27.322V27.2099H14.717V27.322H17.217ZM17.217 35.5002V27.322H14.717V35.5002H17.217ZM24.2573 34.2502H15.967V36.7502H24.2573V34.2502ZM23.0073 27.322V35.5002H25.5073V27.322H23.0073ZM23.0073 27.2099V27.322H25.5073V27.2099H23.0073ZM24.2557 28.4599H24.2573V25.9599H24.2557V28.4599ZM22.7869 26.214C22.9224 26.5412 22.9966 26.8902 23.0062 27.2437L25.5053 27.1761C25.4875 26.5174 25.3491 25.867 25.0966 25.2573L22.7869 26.214ZM22.1593 25.2748C22.4281 25.5436 22.6414 25.8628 22.7869 26.214L25.0966 25.2573C24.8254 24.6028 24.428 24.008 23.9271 23.507L22.1593 25.2748ZM21.22 24.6472C21.5713 24.7927 21.8905 25.006 22.1593 25.2748L23.9271 23.507C23.4261 23.006 22.8313 22.6086 22.1768 22.3375L21.22 24.6472ZM20.5034 24.4534C20.7491 24.4869 20.99 24.5519 21.22 24.6472L22.1768 22.3375C21.748 22.1599 21.299 22.0388 20.8412 21.9763L20.5034 24.4534ZM19.4223 19.1437V23.2148H21.9223V19.1437H19.4223ZM30.531 17.8937H20.6723V20.3937H30.531V17.8937ZM29.281 15.8948V19.1437H31.781V15.8948H29.281ZM29.281 15.7828V15.8948H31.781V15.7828H29.281ZM30.5304 17.0328H30.531V14.5328H30.5304V17.0328Z"
                      fill="black"
                    ></path>
                  </symbol>
                  <use href="#icon-light"></use>
                </svg>
              </div>
              <div className="usp-item-right">
                <h4>THIẾT KẾ ĐỘC BẢN</h4>
                <p>
                  Khám phá các sản phẩm thiết kế giới hạn, độc quyền và đậm chất
                  nghệ thuật.
                </p>
              </div>
            </div>

            <div className="usp-item">
              <div className="usp-item-left">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon-usp shield"
                >
                  <symbol
                    id="icon-shield"
                    viewBox="0 0 40 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.2498 26.4167L27.6665 17L25.2915 14.625L18.2498 21.6667L14.7498 18.1667L12.3748 20.5417L18.2498 26.4167ZM19.9998 37.1667C16.1387 36.1945 12.9512 33.9792 10.4373 30.5209C7.92345 27.0625 6.6665 23.2223 6.6665 19V8.83337L19.9998 3.83337L33.3332 8.83337V19C33.3332 23.2223 32.0762 27.0625 29.5623 30.5209C27.0484 33.9792 23.8609 36.1945 19.9998 37.1667ZM19.9998 33.6667C22.8887 32.75 25.2776 30.9167 27.1665 28.1667C29.0554 25.4167 29.9998 22.3612 29.9998 19V11.125L19.9998 7.37504L9.99984 11.125V19C9.99984 22.3612 10.9443 25.4167 12.8332 28.1667C14.7221 30.9167 17.1109 32.75 19.9998 33.6667Z"
                      fill="black"
                    ></path>
                  </symbol>
                  <use href="#icon-shield"></use>
                </svg>
              </div>
              <div className="usp-item-right">
                <h4>BẢO HÀNH KÉO DÀI</h4>
                <p>Hưởng thêm 1 năm bảo hành mở rộng cho mọi đơn hàng.</p>
              </div>
            </div>

            <div className="usp-item">
              <div className="usp-item-left">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon-usp lock"
                >
                  <symbol
                    id="icon-lock"
                    viewBox="0 0 40 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5129 36.3335C9.68181 36.3335 8.97181 36.0392 8.38292 35.4506C7.79431 34.8617 7.5 34.1517 7.5 33.3206V17.6797C7.5 16.8486 7.79431 16.1386 8.38292 15.5497C8.97181 14.9611 9.68181 14.6668 10.5129 14.6668H12.5V11.3335C12.5 9.25239 13.2297 7.48211 14.6892 6.02266C16.1486 4.56322 17.9189 3.8335 20 3.8335C22.0811 3.8335 23.8514 4.56322 25.3108 6.02266C26.7703 7.48211 27.5 9.25239 27.5 11.3335V14.6668H29.4871C30.3182 14.6668 31.0282 14.9611 31.6171 15.5497C32.2057 16.1386 32.5 16.8486 32.5 17.6797V33.3206C32.5 34.1517 32.2057 34.8617 31.6171 35.4506C31.0282 36.0392 30.3182 36.3335 29.4871 36.3335H10.5129ZM10.5129 33.8335H29.4871C29.6368 33.8335 29.7597 33.7854 29.8558 33.6893C29.9519 33.5932 30 33.4703 30 33.3206V17.6797C30 17.53 29.9519 17.4071 29.8558 17.311C29.7597 17.2149 29.6368 17.1668 29.4871 17.1668H10.5129C10.3632 17.1668 10.2403 17.2149 10.1442 17.311C10.0481 17.4071 10 17.53 10 17.6797V33.3206C10 33.4703 10.0481 33.5932 10.1442 33.6893C10.2403 33.7854 10.3632 33.8335 10.5129 33.8335ZM20 28.4168C20.8097 28.4168 21.4983 28.1332 22.0658 27.566C22.6331 26.9985 22.9167 26.3099 22.9167 25.5002C22.9167 24.6904 22.6331 24.0018 22.0658 23.4343C21.4983 22.8671 20.8097 22.5835 20 22.5835C19.1903 22.5835 18.5017 22.8671 17.9342 23.4343C17.3669 24.0018 17.0833 24.6904 17.0833 25.5002C17.0833 26.3099 17.3669 26.9985 17.9342 27.566C18.5017 28.1332 19.1903 28.4168 20 28.4168ZM15 14.6668H25V11.3335C25 9.94461 24.5139 8.76405 23.5417 7.79183C22.5694 6.81961 21.3889 6.3335 20 6.3335C18.6111 6.3335 17.4306 6.81961 16.4583 7.79183C15.4861 8.76405 15 9.94461 15 11.3335V14.6668Z"
                      fill="black"
                    ></path>
                  </symbol>
                  <use href="#icon-lock"></use>
                </svg>
              </div>
              <div className="usp-item-right">
                <h4>GIAO HÀNG MIỄN PHÍ</h4>
                <p>Miễn phí vận chuyển toàn quốc cho tất cả đơn hàng online.</p>
              </div>
            </div>

            <div className="usp-item">
              <div className="usp-item-left">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon-usp package"
                >
                  <symbol
                    id="icon-package"
                    viewBox="0 0 30 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.75 29.1153V17.2178L3.33333 11.1858V22.7949C3.33333 22.8802 3.35472 22.9603 3.39749 23.0353C3.44027 23.1101 3.5043 23.1741 3.58958 23.2274L13.75 29.1153ZM16.25 29.1153L26.4104 23.2274C26.4957 23.1741 26.5597 23.1101 26.6025 23.0353C26.6453 22.9603 26.6667 22.8802 26.6667 22.7949V11.1858L16.25 17.2178V29.1153ZM13.4937 31.8428L2.34 25.4228C1.86555 25.1495 1.49583 24.7842 1.23083 24.327C0.965828 23.8695 0.833328 23.3673 0.833328 22.8203V10.1795C0.833328 9.63255 0.965828 9.13033 1.23083 8.67283C1.49583 8.21561 1.86555 7.85033 2.34 7.577L13.4937 1.157C13.9679 0.883389 14.47 0.746582 15 0.746582C15.53 0.746582 16.0321 0.883389 16.5062 1.157L27.66 7.577C28.1344 7.85033 28.5042 8.21561 28.7692 8.67283C29.0342 9.13033 29.1667 9.63255 29.1667 10.1795V22.8203C29.1667 23.3673 29.0342 23.8695 28.7692 24.327C28.5042 24.7842 28.1344 25.1495 27.66 25.4228L16.5062 31.8428C16.0321 32.1164 15.53 32.2532 15 32.2532C14.47 32.2532 13.9679 32.1164 13.4937 31.8428ZM21.4262 11.3332L25.2917 9.11533L15.2562 3.31075C15.171 3.25742 15.0856 3.23075 15 3.23075C14.9144 3.23075 14.829 3.25742 14.7437 3.31075L11.125 5.39408L21.4262 11.3332ZM15 15.0641L18.875 12.8203L8.58333 6.87158L4.70833 9.11533L15 15.0641Z"
                      fill="black"
                    ></path>
                  </symbol>
                  <use href="#icon-package"></use>
                </svg>
              </div>
              <div className="usp-item-right">
                <h4>ĐỔI TRẢ DỄ DÀNG</h4>
                <p>Không hài lòng? Đổi trả nhanh gọn trong vòng 30 ngày.</p>
              </div>
            </div>
          </section>
      </div>
    </div>
  );
};

export default Home;
