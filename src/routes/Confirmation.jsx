import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

export default function PurchaseConfirmation() {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/"); // Redirect to the homepage
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={8} md={10} className="text-center">
          <h1 className="mb-4">Thank You for Your Purchase!</h1>
          <p className="mb-4">
            Your order has been successfully processed. You will receive a confirmation email shortly with your order details.
          </p>
          <p className="mb-4">If you have any questions, feel free to contact our support team.</p>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm and Return to Homepage
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
