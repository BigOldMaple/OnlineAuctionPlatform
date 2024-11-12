describe("Bid functionality", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/auction/6");
  });

  it("should show an error when placing a bid lower than the current bid", () => {
    cy.get("button").contains("Place Bid").click();

    cy.get("div.w-full.max-w-md.mx-4.rounded-xl.shadow-2xl")
      .should("be.visible")
      .and("have.class", "bg-gray-800")
      .and("have.class", "relative");
    const minimumBid = 10.01;
    cy.wait(500);
    cy.get('input[placeholder="0.00"]').type("9.50");
    cy.wait(500);
    cy.get("button").contains("Review Bid").click();
    cy.wait(500);
    cy.get(".text-red-300").should("be.visible");
  });
  it("should show an error when not logged in and placing bid", () => {
    cy.get("button").contains("Place Bid").click();
    cy.wait(800);
    const validBid = 200;
    cy.wait(800);
    cy.get('input[placeholder="0.00"]').clear().type(validBid.toFixed(2));
    cy.wait(800);
    cy.get("button").contains("Review Bid").click();
    cy.wait(800);
    cy.get(".text-red-300").should("exist");
    cy.wait(800);
    cy.get("button").contains("Review Bid").should("not.be.disabled").click();
  });
  it("Should log in on login button click", () => {
    cy.viewport(1920, 1080);
    cy.get("button").contains("Login").click();
    cy.origin("https://dev-867cdotto34qdajf.us.auth0.com", () => {
      cy.get(".input.c4ea79246.c882875d6").type("123@321.com");
      cy.get(".input.c4ea79246.c2946f7ad").type("PassWord!1");
      cy.get(
        'button[data-action-button-primary="true"][name="action"][value="default"]'
      ).click();
    });
    cy.wait(4000);
    cy.visit("http://localhost:5173/auction/6");

    cy.get("button").contains("Place Bid").click();
    cy.wait(800);
    const invalidBid = 1;

    const validBid = 205;
    cy.get('input[placeholder="0.00"]').clear().type(invalidBid.toFixed(2));
    cy.get("button").contains("Review Bid").click();
    cy.wait(800);
    cy.get(".text-red-300").should("exist");

    cy.get('input[placeholder="0.00"]').clear().type(validBid.toFixed(2));

    cy.get("button").contains("Review Bid").click();
    cy.get("button").contains("Confirm Bid").click();

    cy.wait(800);
  });
  it("Should be able to click quick links", () => {
    cy.viewport(1920, 1080);

    cy.get("button").contains("Auction List").click();
    cy.get("button").contains("Electronics").click();
    cy.wait(800);
    cy.get("button").contains("Back").click();
    cy.get("button").contains("Jewelery").click();
    cy.wait(800);
    cy.get("button").contains("Back").click();
    cy.get("button").contains("Men's Clothing").click();
    cy.wait(800);
    cy.get("button").contains("Back").click();
    cy.get("button").contains("Women's Clothing").click();
    cy.wait(800);
    cy.get("button").contains("Back").click();
    cy.get("button").contains("AuctionSite").click();
    cy.log("Test completed successfully");
  });
});
