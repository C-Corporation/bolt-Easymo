
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TenantFormProps {
  form: UseFormReturn<any>;
  simplified?: boolean;
}

const TenantForm: React.FC<TenantFormProps> = ({ form, simplified = false }) => {
  if (simplified) {
    return (
      <div className="space-y-4">
        {/* Situation / Status */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800">Situation</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    <SelectItem value="En règle">En règle</SelectItem>
                    <SelectItem value="Pas en règle">Pas en règle</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Unpaid amount */}
          <FormField
            control={form.control}
            name="unpaid"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800">Impayés (FCFA)</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white text-gray-800"
                    type="number"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Localisation</FormLabel>
              <FormControl>
                <Input className="bg-white text-gray-800" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Property Type */}
        <FormField
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Type de bien</FormLabel>
              <FormControl>
                <Input className="bg-white text-gray-800" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Rent, Caution and Caution Months in 3 columns */}
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="rent"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800">Loyer (FCFA)</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white text-gray-800"
                    type="number"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="caution"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800">Caution (FCFA)</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white text-gray-800"
                    type="number"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cautionMonths"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800">Mois de caution</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white text-gray-800"
                    type="number"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Observation */}
        <FormField
          control={form.control}
          name="observation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Observation</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none bg-white text-gray-800"
                  placeholder="RAS"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Personal Information */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Nom</FormLabel>
              <FormControl>
                <Input className="bg-white text-gray-800" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Prénom</FormLabel>
              <FormControl>
                <Input className="bg-white text-gray-800" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Gender and Phone */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Genre</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  <SelectItem value="Homme">Homme</SelectItem>
                  <SelectItem value="Femme">Femme</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Téléphone</FormLabel>
              <FormControl>
                <Input className="bg-white text-gray-800" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Second Name and Birth Date */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="secondName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Deuxième prénom</FormLabel>
              <FormControl>
                <Input className="bg-white text-gray-800" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Date de naissance</FormLabel>
              <FormControl>
                <Input className="bg-white text-gray-800" type="date" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Status and Location */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Situation</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  <SelectItem value="En règle">En règle</SelectItem>
                  <SelectItem value="Pas en règle">Pas en règle</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unpaid"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Impayés (FCFA)</FormLabel>
              <FormControl>
                <Input
                  className="bg-white text-gray-800"
                  type="number"
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Location and Property Type */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Localisation</FormLabel>
              <FormControl>
                <Input className="bg-white text-gray-800" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Type de bien</FormLabel>
              <FormControl>
                <Input className="bg-white text-gray-800" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Rent, Caution and Caution Months */}
      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="rent"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Loyer (FCFA)</FormLabel>
              <FormControl>
                <Input
                  className="bg-white text-gray-800"
                  type="number"
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="caution"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Caution (FCFA)</FormLabel>
              <FormControl>
                <Input
                  className="bg-white text-gray-800"
                  type="number"
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cautionMonths"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Mois de caution</FormLabel>
              <FormControl>
                <Input
                  className="bg-white text-gray-800"
                  type="number"
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value) || 1)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Observation */}
      <FormField
        control={form.control}
        name="observation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-800">Observation</FormLabel>
            <FormControl>
              <Textarea
                className="resize-none bg-white text-gray-800"
                placeholder="RAS"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TenantForm;
