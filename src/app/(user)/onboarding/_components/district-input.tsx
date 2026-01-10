import { SelectInput } from "@/core/presentations/components/select-input";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { useListDistrict } from "@/core/utilities/address/presentation/hooks/use-list-district";
import { useMemo } from "react";

type DistrictInputProps = {
  value?: DistrictEntity;
  onChange?: (district: DistrictEntity | undefined) => void;
  city?: CityEntity;
};

export function DistrictInput(props: DistrictInputProps) {
  const { districts, loading } = useListDistrict({ cityId: props.city?.id });

  const options = useMemo(() => {
    if (!districts) return [];
    return districts.map((district) => ({
      value: district.id,
      label: district.label,
    }));
  }, [districts]);

  const onChange = (selectedId: string) => {
    const selectedDistrict = districts?.find((district) => district.id === selectedId);
    props.onChange?.(selectedDistrict);
  };

  const isDisabled = useMemo(() => loading || !props.city, [loading, props.city]);

  return (
    <SelectInput
      options={options}
      label="Kecamatan"
      placeholder="Pilih Kecamatan"
      disabled={isDisabled}
      value={props.value?.id}
      onChange={onChange}
    />
  );
}
