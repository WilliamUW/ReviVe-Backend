"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Modal,
  Box,
  Slider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Image from "next/image";
import { useUserContext } from "@/component/UserContext";

interface DeviceListing {
  id: number;
  name: string;
  description: string;
  price: number;
  condition: string;
  location: string;
  model: string;
  quality: string;
  imageLinks: string[];
}

export default function Marketplace() {
  const { listings: mockListings } = useUserContext();
  const [listings, setListings] = useState<DeviceListing[]>(mockListings);
  const [filteredListings, setFilteredListings] =
    useState<DeviceListing[]>(mockListings);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<DeviceListing | null>(
    null
  );

  const uniqueModels = Array.from(
    new Set(listings.map((listing) => listing.model))
  );
  const uniqueQualities = Array.from(
    new Set(listings.map((listing) => listing.quality))
  );
  const uniqueLocations = Array.from(
    new Set(listings.map((listing) => listing.location))
  );

  useEffect(() => {
    filterListings();
  }, [
    searchTerm,
    priceRange,
    selectedModel,
    selectedQuality,
    selectedLocation,
  ]);

  const filterListings = () => {
    let filtered = listings.filter(
      (listing) =>
        (listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          listing.model.toLowerCase().includes(searchTerm.toLowerCase())) &&
        listing.price >= priceRange[0] &&
        listing.price <= priceRange[1] &&
        (selectedModel === "" || listing.model === selectedModel) &&
        (selectedQuality === "" || listing.quality === selectedQuality) &&
        (selectedLocation === "" || listing.location === selectedLocation)
    );
    setFilteredListings(filtered);
  };

  const handleListingClick = (listing: DeviceListing) => {
    setSelectedListing(listing);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 pb-20">
      <h1 className="text-3xl font-bold mb-4">ReviVe Marketplace</h1>

      <div className="w-full max-w-4xl mb-4 space-y-4">
        <TextField
          fullWidth
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Typography gutterBottom>Price Range</Typography>
        <Slider
          value={priceRange}
          onChange={(_, newValue) => setPriceRange(newValue as number[])}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
        />

        <FormControl fullWidth>
          <InputLabel>Model</InputLabel>
          <Select
            value={selectedModel}
            label="Model"
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {uniqueModels.map((model) => (
              <MenuItem key={model} value={model}>
                {model}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Quality</InputLabel>
          <Select
            value={selectedQuality}
            label="Quality"
            onChange={(e) => setSelectedQuality(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {uniqueQualities.map((quality) => (
              <MenuItem key={quality} value={quality}>
                {quality}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Location</InputLabel>
          <Select
            value={selectedLocation}
            label="Location"
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {uniqueLocations.map((location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredListings.map((listing) => (
          <Card
            key={listing.id}
            onClick={() => handleListingClick(listing)}
            className="cursor-pointer"
          >
            <CardMedia
              component="img"
              height="140"
              image={listing.imageLinks[0]}
              alt={listing.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {listing.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${listing.price} - {listing.condition}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {listing.location}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                className="text-green-600 font-bold text-xl mt-4"
              >
                B3TR Reward: {listing.b3tr_reward}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedListing && (
            <>
              <div className="flex mb-4 space-x-2 overflow-x-auto">
                {selectedListing.imageLinks.map((link, index) => (
                  <Image
                    key={index}
                    src={link}
                    alt={`${selectedListing.name} ${index + 1}`}
                    width={200}
                    height={200}
                  />
                ))}
              </div>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {selectedListing.name}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Price: ${selectedListing.price}
                <br />
                Condition: {selectedListing.condition}
                <br />
                Model: {selectedListing.model}
                <br />
                Quality: {selectedListing.quality}
                <br />
                Location: {selectedListing.location}
                <br />
                Description: {selectedListing.description}
                <br />
                B3TR Reward: {selectedListing.b3tr_reward}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}
