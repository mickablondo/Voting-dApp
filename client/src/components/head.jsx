import { Navbar, NavbarBrand } from 'reactstrap';

const Head = () => {
  return (
    <>
      <Navbar className="me-auto" color="light" light>
        <NavbarBrand href="/">
          <img
            alt="logo"
            src="/vote-icon.png"
            style={{ height: 40, width: 40, marginRight: 12 }}
          />
          Voting
        </NavbarBrand>
      </Navbar>
    </>
  )
}

export default Head