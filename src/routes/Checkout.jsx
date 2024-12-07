import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../routes/AuthContext";

const apiHost = import.meta.env.VITE_API_HOST;

export default function Checkout() {
  const navigate = useNavigate();
  const { user, loading, setUser } = useAuth(); 
  const [status, setStatus] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();


  const onSubmit = async (data) => {
    console.log("User in onSubmit:", user); 
    if (!user) {
      setStatus("User not logged in");
      return;
    }
  
    const formData = {
      customer_id: user.customer_id,
      street: data.street,
      city: data.city,
      province: data.province,
      country: data.country,
      postal_code: data.postal_code,
      credit_card: data.credit_card,
      credit_expire: data.credit_expire,
      credit_cvv: data.credit_cvv,
      cart: Cookies.get("cart"),
    };
  
    try {
      console.log("Submitting formData:", formData);
      const response = await fetch(`${apiHost}/api/products/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("Purchase successful:", responseData);
        Cookies.remove("cart");
        navigate("/confirmation");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to complete the purchase. Please try again.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setStatus(error.message || "An error occurred during checkout. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };
  const handleCancel = () => {
    navigate("/cart");
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={12} md={10}>
          <h2 className="mb-4 text-center">Checkout</h2>
          {status && (
            <Alert variant="danger" className="text-center">
              {status}
            </Alert>
          )}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <h4 className="mb-3">Shipping Address</h4>
            <Form.Group className="mb-3">
              <Form.Label>Street</Form.Label>
              <Form.Control
                {...register("street", {
                  required: "Street address is required.",
                })}
                type="text"
                isInvalid={!!errors.street}
              />
              <Form.Control.Feedback type="invalid">
                {errors.street?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    {...register("city", {
                      required: "City is required.",
                    })}
                    type="text"
                    isInvalid={!!errors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Province</Form.Label>
                  <Form.Control
                    {...register("province", {
                      required: "Province is required.",
                    })}
                    type="text"
                    isInvalid={!!errors.province}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.province?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    {...register("country", {
                      required: "Country is required.",
                    })}
                    type="text"
                    defaultValue="Canada"
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    {...register("postal_code", {
                      required: "Postal code is required.",
                      pattern: {
                        value: /^[A-Za-z0-9]+$/,
                        message: "Postal code can only contain letters and numbers.",
                      },
                    })}
                    type="text"
                    isInvalid={!!errors.postal_code}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.postal_code?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <h4 className="mb-3">Payment Details</h4>
            <Form.Group className="mb-3">
              <Form.Label>Credit Card Number</Form.Label>
              <Form.Control
                {...register("credit_card", {
                  required: "Credit card number is required.",
                  pattern: {
                    value: /^\d{16}$/,
                    message: "Credit card number must be 16 digits.",
                  },
                })}
                type="text"
                isInvalid={!!errors.credit_card}
              />
              <Form.Control.Feedback type="invalid">
                {errors.credit_card?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiration Date (MM/YY)</Form.Label>
                  <Form.Control
                    {...register("credit_expire", {
                      required: "Expiration date is required.",
                      pattern: {
                        value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                        message: "Expiration date must be in MM/YY format.",
                      },
                      validate: {
                        notPast: (value) => {
                          const [month, year] = value.split("/").map(Number);
                          const currentDate = new Date();
                          const currentMonth = currentDate.getMonth() + 1;
                          const currentYear = parseInt(currentDate.getFullYear().toString().slice(-2));
                          if (year < currentYear || (year === currentYear && month < currentMonth)) {
                            return "Expiration date cannot be in the past.";
                          }
                          return true;
                        },
                      },
                    })}
                    type="text"
                    isInvalid={!!errors.credit_expire}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.credit_expire?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    {...register("credit_cvv", {
                      required: "CVV is required.",
                      pattern: {
                        value: /^\d{3}$/,
                        message: "CVV must be 3 digits.",
                      },
                    })}
                    type="text"
                    isInvalid={!!errors.credit_cvv}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.credit_cvv?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {loading ? (
              <div className="text-center mt-4">
                <Spinner animation="border" />
                <p>Processing payment...</p>
              </div>
            ) : (
              <div className="d-flex justify-content-between mt-4">
                <Button variant="primary" type="submit">
                  Confirm and Pay
                </Button>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
